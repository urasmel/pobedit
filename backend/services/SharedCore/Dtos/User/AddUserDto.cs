﻿namespace SharedCore.Dtos.User
{
    public class AddUserDto
    {
        public string? Username { get; set; } = string.Empty;
        public string? Password { get; set; } = string.Empty;
        public string? PhoneNumber { set; get; }
    }
}
