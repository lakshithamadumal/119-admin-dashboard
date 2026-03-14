package lk.iamlaky.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.io.InputStream;

@WebListener
public class FirebaseConfig implements ServletContextListener {

    private static Firestore db;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            InputStream serviceAccount = getClass().getClassLoader()
                    .getResourceAsStream("serviceAccountKey.json");

            if (serviceAccount == null) {
                System.out.println("Error: serviceAccountKey.json not found!");
                return;
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            db = FirestoreClient.getFirestore();
            System.out.println("Firebase and Firestore successfully connected!");

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Could not connect to Firebase!");
        }
    }

    public static Firestore getDb() {
        return db;
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }
}