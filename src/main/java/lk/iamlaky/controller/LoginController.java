package lk.iamlaky.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lk.iamlaky.config.FirebaseConfig;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet(name = "LoginController", urlPatterns = {"/login-auth"})
public class LoginController extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        resp.setContentType("text/plain");

        String user = req.getParameter("email");
        String pass = req.getParameter("password");

        try {

            Firestore db = FirebaseConfig.getDb();
            CollectionReference admins = db.collection("admins");
            Query query = admins.whereEqualTo("email", user);
            ApiFuture<QuerySnapshot> future = query.get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            if (!documents.isEmpty()) {

                DocumentSnapshot adminDoc = documents.get(0);
                String dbPassword = adminDoc.getString("password");
                if (dbPassword != null && dbPassword.equals(pass)) {

                    HttpSession session = req.getSession(true);
                    session.setAttribute("adminUser", user);
                    resp.getWriter().write("success");

                } else {
                    resp.getWriter().write("invalid_password");
                }

            } else {
                resp.getWriter().write("user_not_found");
            }

        } catch (Exception e) {

            e.printStackTrace();
            resp.getWriter().write("error");

        }
    }
}