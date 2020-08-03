package com.google.sps.servlets;

<<<<<<< HEAD
import com.google.sps.data.DatastoreClient;
import com.google.sps.data.DatastoreClientInterface;
import com.google.sps.data.Session;
import com.google.sps.data.SessionInterface;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
=======
import java.io.IOException;
>>>>>>> ae7322a7d9daa51d6d9878fb4c1cd0c50090aa85
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
    Optional<SessionInterface> sessionInterface = datastoreClient.getSession(sessionId);
    if(sessionInterface.isPresent()) {
      SessionInterface updatedSession =
          new Session(sessionId, Optional.of(name), sessionInterface.get().getIpOfVM());
      datastoreClient.insertOrUpdateSession(updatedSession);
      response.setStatus(HttpServletResponse.SC_OK);
    } else {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }
  }
}