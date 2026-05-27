namespace Gr8.Api.Endpoints

// This file defines the Endpoints class, which contains a static method MapEndpoints. This method is responsible for
// mapping all the API endpoints for the application. It calls the MapCommunityEndpoints, MapIdentityEndpoints,
// MapActivityEndpoints, and MapChatEndpoints methods to register the respective endpoints for each module of the application.
{
    public static class Endpoints
    {
        public static void MapEndpoints(this WebApplication app)
        {
            CommunityEndpoints.MapCommunityEndpoints(app);
            IdentityEndpoints.MapIdentityEndpoints(app);
            ActivityEndpoints.MapActivityEndpoints(app);
            ChatEndpoints.MapChatEndpoints(app);
        }
    }
}
