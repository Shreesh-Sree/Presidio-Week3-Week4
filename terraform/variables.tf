variable "aws_region" {
  type        = string
  description = "The target AWS Region for deployment"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Target deployment lifecycle workspace (e.g. production, staging, development)"
  default     = "production"
}
