terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 1. KMS Encryption Key for Secure Secrets/Buckets
resource "aws_kms_key" "app_kms" {
  description             = "KMS Key for encrypting Presidio production assets and secrets"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Environment = var.environment
  }
}

# 2. S3 Bucket for Static Web Hosting
resource "aws_s3_bucket" "website_bucket" {
  bucket        = "presidio-sde-dashboard-${var.environment}-assets"
  force_destroy = true

  tags = {
    Environment = var.environment
  }
}

# Enforce Server-side Encryption (SSE-KMS)
resource "aws_s3_bucket_server_side_encryption_configuration" "bucket_encryption" {
  bucket = aws_s3_bucket.website_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.app_kms.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

# Enforce Block Public Access (Access control security best practice)
resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket = aws_s3_bucket.website_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 3. Least Privilege IAM Role for Dashboard Runner Service
resource "aws_iam_role" "dashboard_role" {
  name = "presidio-dashboard-service-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# Least Privilege Policy Attachment (Limit access strictly to the website bucket only)
resource "aws_iam_policy" "dashboard_s3_policy" {
  name        = "presidio-dashboard-s3-read-write"
  description = "Provides read and write access to the specific Presidio web static bucket only"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ],
        Resource = [
          aws_s3_bucket.website_bucket.arn,
          "${aws_s3_bucket.website_bucket.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ],
        Resource = aws_kms_key.app_kms.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_s3_policy" {
  role       = aws_iam_role.dashboard_role.name
  policy_arn = aws_iam_policy.dashboard_s3_policy.arn
}
