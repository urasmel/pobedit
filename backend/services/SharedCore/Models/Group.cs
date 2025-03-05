﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedCore.Models
{
    public class Group
    {
        public long Id { get; set; }
        public long TlgId { get; set; }
        public Account? Owner { get; set; }
        public string? MainUsername { get; set; }
        public string? Title { get; set; }
        public List<Account> Subscribers { get; set; } = new List<Account>();
        public string? Image { get; set; }
        public string? About { get; set; } = string.Empty;
        public int ParticipantsCount { get; set; } = 0;
    }
}
