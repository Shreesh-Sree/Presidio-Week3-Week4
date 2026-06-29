output "s3_bucket_arn" {
  value       = aws_s3_bucket.website_bucket.arn
  description = "The Amazon Resource Name (ARN) of the static asset bucket"
}

output "dashboard_service_role_arn" {
  value       = aws_iam_role.dashboard_role.arn
  description = "The IAM Role ARN bound to the EC2 host with Least Privilege access to resources"
}
