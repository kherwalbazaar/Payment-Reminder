terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 7.0"
    }
  }
}

provider "google-beta" {
  user_project_override = true
}

# Bind to your existing Google Cloud Project
data "google_project" "default" {
  project_id = "com-example-paymentremin-efec3"
}

# Enable Firebase services for the project
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = data.google_project.default.project_id
}

# Register your Android App
resource "google_firebase_android_app" "default" {
  provider     = google-beta
  project      = google_firebase_project.default.project
  display_name = "Payment Reminder"
  package_name = "com.example.paymentreminder"
}

# Provision your default Firestore database in nam5
resource "google_firestore_database" "default" {
  provider         = google-beta
  project          = google_firebase_project.default.project
  name             = "(default)"
  location_id      = "nam5"
  type             = "FIRESTORE_NATIVE"
  concurrency_mode = "OPTIMISTIC"
}
