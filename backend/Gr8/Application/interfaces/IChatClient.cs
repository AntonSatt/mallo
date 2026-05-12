using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IChatClient
    {
        //Defines real time chat events that the connected users can receive from the server.
        Task ReceiveMessage(ChatMessageResponseDto message);
    }
}
