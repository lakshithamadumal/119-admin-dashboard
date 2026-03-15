package lk.iamlaky.controller;

import java.io.IOException;
import java.util.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.google.cloud.firestore.*;
import com.google.gson.Gson;
import lk.iamlaky.config.FirebaseConfig;

@WebServlet(name = "GetDashboardStats", urlPatterns = {"/get-stats"})
public class GetDashboardStats extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        Map<String, Object> stats = new HashMap<>();
        try {
            Firestore db = FirebaseConfig.getDb();

            long totalReports = db.collection("reports").count().get().get().getCount();
            long totalSOS = db.collection("emergency_reports").count().get().get().getCount();
            long totalUsers = db.collection("users").count().get().get().getCount();

            Calendar cal = Calendar.getInstance();
            cal.set(Calendar.HOUR_OF_DAY, 0); cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0); cal.set(Calendar.MILLISECOND, 0);
            com.google.cloud.Timestamp todayStart = com.google.cloud.Timestamp.of(cal.getTime());

            long todayReports = db.collection("reports").whereGreaterThanOrEqualTo("timestamp", todayStart).count().get().get().getCount();
            long todaySOS = db.collection("emergency_reports").whereGreaterThanOrEqualTo("timestamp", todayStart).count().get().get().getCount();

            Integer[] weeklyData = new Integer[7];
            Arrays.fill(weeklyData, 0);

            stats.put("totalReports", totalReports);
            stats.put("totalSOS", totalSOS);
            stats.put("todayReports", todayReports + todaySOS);
            stats.put("allMembers", totalUsers);
            stats.put("weeklyTrend", Arrays.asList(0, 0, 0, 2, 5, 3, (int)(todayReports + todaySOS))); // Sample trend based on today

            resp.getWriter().write(new Gson().toJson(stats));
        } catch (Exception e) {
            resp.getWriter().write("{\"error\": true}");
        }
    }
}