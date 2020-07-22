package com.google.sps.servlets;

import com.google.gson.*;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns a Session object */
@WebServlet("/get-session")
public class GetSessionServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String sessionId =
        URLDecoder.decode(request.getParameter("session-id"), StandardCharsets.UTF_8);
    String name = URLDecoder.decode(request.getParameter("name"), StandardCharsets.UTF_8);
    // Session session = retrieveSession(sessionId);
    // updateDateLastPolled(sessionId, name);
    // List<String/Attendee?> listOfAttendees = getListOfAttendees(sessionId);
    Gson gson = new Gson();
    JsonElement jsonElement = gson.toJsonTree(session);
    jsonElement.getAsJsonObject().addProperty("listOfAttendees", String.join(", ", listOfAttendees);
    String json = gson.toJson(jsonElement);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }
}
