package lk.iamlaky.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.gson.Gson;
import lk.iamlaky.config.FirebaseConfig;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "GetDashboardStats", urlPatterns = {"/get-stats"})
public class GetDashboardStats extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        Map<String, Integer> stats = new HashMap<>();

        try {
            Firestore db = FirebaseConfig.getDb();

            stats.put("totalReports", db.collection("reports").get().get().size());

            stats.put("totalSOS", db.collection("emergency_reports").get().get().size());

            Query activeQuery = db.collection("emergency_reports").whereNotEqualTo("status", "Complete");
            stats.put("activeEmergency", activeQuery.get().get().size());

            stats.put("allMembers", db.collection("users").get().get().size());

            String json = new Gson().toJson(stats);
            resp.getWriter().write(json);

        } catch (Exception e) {
            e.printStackTrace();
            resp.getWriter().write("{\"error\": true}");
        }
    }
}