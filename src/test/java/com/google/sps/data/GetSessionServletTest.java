package com.google.sps.data;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.sps.servlets.GetSessionServlet;
import org.junit.Before;
import org.junit.After;
import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;

public class GetSessionServletTest {
  private final LocalServiceTestHelper helper =
      new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig());

  @Mock
  HttpServletRequest request;

  @Mock
  HttpServletResponse response;

  @Mock
  DatastoreClientInterface datastoreClient;

  @Spy
  GetSessionServlet servlet;

  @Before
  public void setUp() throws Exception {
    helper.setUp();
    MockitoAnnotations.openMocks(this);
  }

  @After
  public void tearDown() {
    helper.tearDown();
  }

  @Test
  public void testDoGet() throws Exception {
    // DatastoreClientInterface datastoreClient = mock(DatastoreClient.class);
    //AttendeeInterface attendee = mock(Attendee.class);
    Optional<Session> expectedSession =
        Optional.of(new Session("EEEEE7", Optional.of("Jessica"), Optional.of("12.34.56.78")));
    List<String> listOfAttendees = Arrays.asList("Jessica", "Bradley", "Noel");
    doNothing().when(datastoreClient).insertOrUpdateAttendee(any());
    when(request.getParameter("session-id")).thenReturn("EEEEE7");
    when(request.getParameter("name")).thenReturn("Jessica");
    Mockito.doReturn(expectedSession).when(datastoreClient).getSession("EEEEE7");
    //when(datastoreClient.getSession(anyString())).thenReturn(expectedSession);
    Mockito.doReturn(Optional.of(listOfAttendees)).when(datastoreClient).getListOfAttendeesInSession("EEEEE7");
    //when(datastoreClient.getListOfAttendeesInSession("EEEEE7")).
       // thenReturn(Optional.of(listOfAttendees));
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    when(response.getWriter()).thenReturn(pw);
    servlet.doGet(request, response);
    String actualResult = sw.getBuffer().toString().trim();
    assertEquals("hello", actualResult);
  }
}