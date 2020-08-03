package com.google.sps.data;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;
import java.io.IOException;
import java.util.Optional;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.sps.servlets.ChangeControllerServlet;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;

public class ChangeControllerServletTest {
  private final LocalServiceTestHelper helper =
      new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig());

  @Mock
  HttpServletRequest request;

  @Mock
  HttpServletResponse response;

  @Spy
  ChangeControllerServlet servlet = new ChangeControllerServlet();

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
  public void testDoPost() throws IOException, ServletException {
    when(request.getParameter("session-id")).thenReturn("EEEEE7");
    when(request.getParameter("name")).thenReturn("Jessica");
    SessionInterface oldSession =
        new Session("EEEEE7", Optional.of("Bryan"), Optional.of("12.34.56.78"));
    SessionInterface updatedExpectedSession =
        new Session("EEEEE7", Optional.of("Jessica"), Optional.of("12.34.56.78"));
    DatastoreService datastoreService = DatastoreServiceFactory.getDatastoreService();
    DatastoreClientInterface datastoreClient = new DatastoreClient();
    datastoreClient.insertOrUpdateSession(oldSession);
    servlet.doPost(request, response);
    assertEquals(updatedExpectedSession, datastoreClient.getSession("EEEEE7").get());
    Mockito.verify(response).setStatus(HttpServletResponse.SC_OK);
  }
}