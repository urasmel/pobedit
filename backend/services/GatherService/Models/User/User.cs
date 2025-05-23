﻿using System.ComponentModel.DataAnnotations;

namespace Gather.Models;

public class User
{
    public long UserId { get; set; }

    [Required]
    public string? Username { get; set; }

    public string? Password { get; set; }

    public string? PhoneNumber { set; get; }
}
