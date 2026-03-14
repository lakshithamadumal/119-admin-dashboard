package lk.iamlaky.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.gson.Gson;
import lk.iamlaky.config.FirebaseConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.*;

@WebServlet(name = "GetDashboardStats", urlPatterns = {"/get-stats"})
public class GetDashboardStats extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        Map<String, Object> stats = new HashMap<>();
        try {
            Firestore db = FirebaseConfig.getDb();
            stats.put("totalReports", db.collection("reports").get().get().size());
            stats.put("totalSOS", db.collection("emergency_reports").get().get().size());
            stats.put("allMembers", db.collection("users").get().get().size());

            int todayGrandTotal = 0;
            Integer[] weeklyData = new Integer[7];
            Arrays.fill(weeklyData, 0);

            Calendar cal = Calendar.getInstance();
            cal.set(Calendar.HOUR_OF_DAY, 0); cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0); cal.set(Calendar.MILLISECOND, 0);
            Date todayStart = cal.getTime();

            List<String> collections = Arrays.asList("reports", "emergency_reports");
            for (String colName : collections) {
                List<QueryDocumentSnapshot> documents = db.collection(colName).get().get().getDocuments();
                for (QueryDocumentSnapshot document : documents) {
                    Object timeObj = document.get("timestamp");
                    Date reportDate = null;
                    if (timeObj instanceof com.google.cloud.Timestamp) reportDate = ((com.google.cloud.Timestamp) timeObj).toDate();
                    else if (timeObj instanceof Long) reportDate = new Date((Long) timeObj);

                    if (reportDate != null) {
                        if (reportDate.after(todayStart)) todayGrandTotal++;
                        for (int i = 0; i < 7; i++) {
                            Calendar dayCheck = Calendar.getInstance();
                            dayCheck.add(Calendar.DAY_OF_YEAR, -i);
                            Calendar reportCal = Calendar.getInstance();
                            reportCal.setTime(reportDate);
                            if (reportCal.get(Calendar.YEAR) == dayCheck.get(Calendar.YEAR) &&
                                    reportCal.get(Calendar.DAY_OF_YEAR) == dayCheck.get(Calendar.DAY_OF_YEAR)) {
                                weeklyData[i]++;
                            }
                        }
                    }
                }
            }
            List<Integer> trendList = Arrays.asList(weeklyData);
            Collections.reverse(trendList);
            stats.put("todayReports", todayGrandTotal);
            stats.put("weeklyTrend", trendList);
            resp.getWriter().write(new Gson().toJson(stats));
        } catch (Exception e) {
            e.printStackTrace();
            resp.getWriter().write("{\"error\": true}");
        }
    }
}