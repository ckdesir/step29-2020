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
import java.util.Date;
import java.util.List;
import java.util.Optional;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.sps.servlets.GetSessionServlet;
import org.junit.Before;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Session.class)
public class GetSessionServletTest {
  private final LocalServiceTestHelper helper =
      new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig());

  @Mock
  HttpServletRequest request;

  @Mock
  HttpServletResponse response;

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
    SessionInterface expectedSession =
        new Session("EEEEE7", Optional.of("Jessica"), Optional.of("12.34.56.78"));
    AttendeeInterface expectedAttendee =
        new Attendee("EEEEE7", "Jessica", new Date());
    DatastoreService datastoreService = DatastoreServiceFactory.getDatastoreService();
    DatastoreClientInterface datastoreClient = new DatastoreClient();
    datastoreClient.insertOrUpdateSession(expectedSession);
    datastoreClient.insertOrUpdateAttendee(expectedAttendee);
    when(request.getParameter("session-id")).thenReturn("EEEEE7");
    when(request.getParameter("name")).thenReturn("Jessica");




    // DatastoreClientInterface datastoreClient = mock(DatastoreClient.class);
    // DatastoreService datastoreMock = mock(DatastoreService.class);
    // PreparedQuery pqMock = mock(PreparedQuery.class);
    // Session mockSession = mock(Session.class);
    // PowerMockito.mockStatic(Session.class);
    //AttendeeInterface attendee = mock(Attendee.class);
    Optional<Session> expectedSession =
        Optional.of(new Session("EEEEE7", Optional.of("Jessica"), Optional.of("12.34.56.78")));
    when(pqMock.asSingleEntity()).thenReturn(expectedSession.get().toEntity());
    // Mockito.doReturn(expectedSession.get()).when(Session.fromEntity(any()));
    // //Session.fromEntity(any());
    when(Session.fromEntity(expectedSession.get().toEntity())).thenReturn(expectedSession.get());
    List<String> listOfAttendees = Arrays.asList("Jessica", "Bradley", "Noel");
    doNothing().when(datastoreClient).insertOrUpdateAttendee(any());
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