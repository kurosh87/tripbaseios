//
//  SignUpButtons.swift
//  FirebaseKit (Generated by SwiftyLaunch 1.5.0)
//  https://docs.swiftylaun.ch/module/authkit/email-sign-in-flow
//  https://docs.swiftylaun.ch/module/authkit/sign-in-with-apple-flow
//

import AnalyticsKit
import AuthenticationServices
import SharedKit
import SwiftUI
import UIKit

struct SignUpButtons: View {

	@EnvironmentObject var db: DB
	let shouldShowEmailSignUpScreen: () -> Void

	var body: some View {
		VStack(alignment: .leading) {

			EmailSignUpButton(
				shouldShowEmailSignUpScreen: shouldShowEmailSignUpScreen
			)

			// You can also adapt this to show ToS and Privacy Policy with .webViewSheet
			Text(
				// need .init for markdown links to work
				.init(
					"By creating an Account you consent to our [ToS](\(Constants.AppData.termsOfServiceURL)) and [Privacy Policy](\(Constants.AppData.privacyPolicyURL))."
				)
			)
			.foregroundStyle(.secondary)
			.font(.caption)
			.padding(.top, 5)
			.frame(maxWidth: .infinity, alignment: .leading)
		}
	}
}

struct EmailSignUpButton: View {

	let shouldShowEmailSignUpScreen: () -> Void

	var body: some View {
		Button(
			action: {
				shouldShowEmailSignUpScreen()
			},
			label: {
				HStack {
					Image(systemName: "envelope")
						.fontWeight(.semibold)
					Text("Sign Up using Email")
				}
			}
		)
		.buttonStyle(.secondary())
		.captureTaps("sign_up_email_btn", fromView: "SignUpButtons", relevancy: .high)
	}
}

#Preview {
	SignUpButtons(shouldShowEmailSignUpScreen: {})
		.padding()
}
