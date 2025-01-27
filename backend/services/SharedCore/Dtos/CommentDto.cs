﻿using SharedCore.Models;

namespace SharedCore.Dtos;

public class CommentDto
{
    public long TlgId { get; set; }
    public long PeerId { get; set; }
    public long PostId { get; set; }
    public Account? From { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime Date { get; set; }

}
