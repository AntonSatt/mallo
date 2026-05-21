namespace Gr8.Api.Endpoints
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
