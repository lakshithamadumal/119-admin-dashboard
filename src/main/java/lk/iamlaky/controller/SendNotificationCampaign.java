package lk.iamlaky.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.SendResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import lk.iamlaky.config.FirebaseConfig;

@WebServlet(name = "SendNotificationCampaign", urlPatterns = {"/send-notification-campaign"})
public class SendNotificationCampaign extends HttpServlet {

    private static final Gson GSON = new Gson();
    private static final int FCM_CHUNK_SIZE = 500;

    private static final List<String> TOKEN_FIELD_KEYS = Arrays.asList(
            "fcmToken",
            "fcmTokens",
            "notificationToken",
            "notificationTokens",
            "deviceToken",
            "deviceTokens",
            "pushToken",
            "pushTokens",
            "token",
            "tokens"
    );

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        JsonObject requestBody;
        try {
            requestBody = JsonParser.parseReader(req.getReader()).getAsJsonObject();
        } catch (Exception ex) {
            respondError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid request body.");
            return;
        }

        String title = getString(requestBody, "title");
        String description = getString(requestBody, "description");
        String type = getString(requestBody, "type");
        if (type.isBlank()) { type = "SYSTEM"; }

        if (title.isBlank() || description.isBlank()) {
            respondError(resp, HttpServletResponse.SC_BAD_REQUEST, "Title and description are required.");
            return;
        }

        Firestore db = FirebaseConfig.getDb();
        if (db == null) {
            System.err.println("CRITICAL: Firestore DB is NULL in SendNotificationCampaign!");
            respondError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Firestore is not initialized.");
            return;
        }

        try {
            // 💡 ටෝකන් කීයක් එනවද කියලා බලන්න ලොග් එකක් දාමු
            QuerySnapshot usersSnapshot = db.collection("users").get().get();
            Set<String> uniqueTokens = new LinkedHashSet<>();

            for (DocumentSnapshot userDoc : usersSnapshot.getDocuments()) {
                collectTokens(userDoc.getData(), uniqueTokens);
            }

            List<String> tokens = new ArrayList<>(uniqueTokens);
            System.out.println("DEBUG: Total tokens to process: " + tokens.size());

            int successCount = 0;
            int failureCount = 0;
            int invalidTokenCount = 0;

            if (tokens.isEmpty()) {
                System.out.println("DEBUG: No tokens found in users collection.");
            }

            for (List<String> tokenChunk : split(tokens, FCM_CHUNK_SIZE)) {
                MulticastMessage message = MulticastMessage.builder()
                        .setNotification(Notification.builder()
                                .setTitle(title)
                                .setBody(description)
                                .build())
                        .putData("title", title)
                        .putData("description", description)
                        .putData("type", type)
                        .setAndroidConfig(AndroidConfig.builder()
                                .setPriority(AndroidConfig.Priority.HIGH)
                                .setNotification(AndroidNotification.builder()
                                        .setChannelId("emergency_alerts")
                                        .setSound("default")
                                        .build())
                                .build())
                        .addAllTokens(tokenChunk)
                        .build();

                System.out.println("DEBUG: Dispatching multicast message...");
                BatchResponse batchResponse = FirebaseMessaging.getInstance().sendEachForMulticast(message);

                successCount += batchResponse.getSuccessCount();
                failureCount += batchResponse.getFailureCount();

                System.out.println("DEBUG: Chunk Sent! Success: " + successCount + ", Fail: " + failureCount);
            }

            JsonObject responseBody = new JsonObject();
            responseBody.addProperty("success", true);
            responseBody.addProperty("totalTokens", tokens.size());
            responseBody.addProperty("sentCount", successCount);
            responseBody.addProperty("failedCount", failureCount);
            responseBody.addProperty("message", "Processed successfully");

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(GSON.toJson(responseBody));

        } catch (Exception ex) {
            // 💡 වැදගත්ම දේ: මෙන්න මේ ලොග් එක NetBeans වල බලන්න
            System.err.println("FCM FATAL ERROR: " + ex.getMessage());
            ex.printStackTrace(); // 👈 සැබෑ Error එක මෙතනින් පේනවා

            respondError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "FCM Error: " + ex.getMessage());
        }
    }

    private static void collectTokens(Map<String, Object> userData, Set<String> target) {
        if (userData == null || userData.isEmpty()) {
            return;
        }

        for (String key : TOKEN_FIELD_KEYS) {
            addTokenValue(userData.get(key), target);
        }

        for (Map.Entry<String, Object> entry : userData.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (key != null && key.toLowerCase(Locale.ROOT).contains("token")) {
                addTokenValue(value, target);
            }
            if (value instanceof Map<?, ?> nestedMap) {
                for (Object nestedValue : nestedMap.values()) {
                    addTokenValue(nestedValue, target);
                }
            }
        }
    }

    private static void addTokenValue(Object value, Set<String> target) {
        if (value == null) {
            return;
        }

        if (value instanceof String token) {
            String sanitized = token.trim();
            if (looksLikeToken(sanitized)) {
                target.add(sanitized);
            }
            return;
        }

        if (value instanceof List<?> list) {
            for (Object item : list) {
                addTokenValue(item, target);
            }
        }
    }

    private static boolean looksLikeToken(String token) {
        return !token.isBlank() && token.length() >= 20 && !token.contains(" ");
    }

    private static List<List<String>> split(List<String> items, int chunkSize) {
        List<List<String>> chunks = new LinkedList<>();
        for (int index = 0; index < items.size(); index += chunkSize) {
            int end = Math.min(index + chunkSize, items.size());
            chunks.add(items.subList(index, end));
        }
        return chunks;
    }

    private static String getString(JsonObject payload, String fieldName) {
        if (payload == null || !payload.has(fieldName) || payload.get(fieldName).isJsonNull()) {
            return "";
        }
        return payload.get(fieldName).getAsString().trim();
    }

    private void respondError(HttpServletResponse resp, int statusCode, String message) throws IOException {
        resp.setStatus(statusCode);
        JsonObject body = new JsonObject();
        body.addProperty("success", false);
        body.addProperty("message", message);
        resp.getWriter().write(GSON.toJson(body));
    }
}