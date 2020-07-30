package com.google.sps.servlets;

import com.google.sps.data.DatastoreClient;
import com.google.sps.data.DatastoreClientInterface;
import com.google.sps.data.Session;
import com.google.sps.data.SessionInterface;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that changes the controller of a Session. */
@WebServlet("/change-controller")
public class ChangeControllerServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DatastoreClientInterface datastoreClient = new DatastoreClient();
    String sessionId =
        URLDecoder.decode(request.getParameter("session-id"), StandardCharsets.UTF_8);
    String name = URLDecoder.decode(request.getParameter("name"), StandardCharsets.UTF_8);
    Optional<SessionInterface> sessionInterface;
    try {
      sessionInterface = datastoreClient.getSession(sessionId);
      if(sessionInterface.isPresent()) {
        SessionInterface updatedSession =
            new Session(sessionId, Optional.of(name), sessionInterface.get().getIpOfVM());
        datastoreClient.insertOrUpdateSession(updatedSession);
        response.setStatus(HttpServletResponse.SC_OK);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}