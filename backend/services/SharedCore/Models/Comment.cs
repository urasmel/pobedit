﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedCore.Models
{
    public class Comment
    {
        public long Id { get; set; }

        public long TlgId { get; set; }

        public long PostId {  get; set; }

        [Required]
        public Account? Author { get; set; }

        public string Message { get; set; } = string.Empty;

        public DateTime Created { get; set; }

        public long ReplyTo {  get; set; }
    }
}
