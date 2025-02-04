//
//  String+Extensions.swift
//  FirebaseKit (Generated by SwiftyLaunch 1.5.0)
//

import Foundation
import SwiftUI

//MARK: - Validation (Used for Sign In)

struct Validation {
	let pattern: String  // Regular expression pattern
	let validationDescription: LocalizedStringKey
	let validationError: LocalizedStringKey
}

public enum ValidationType {
	case email
	case atLeast8Chars
	case onlyAllowedChars
	case requiresAtLeastOneSpecialChar

	var validationData: Validation {
		switch self {
			case .email:
				return Validation(
					pattern: "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}",
					validationDescription: "A valid email address",
					validationError: "Invalid email address"
				)
			case .atLeast8Chars:
				return Validation(
					pattern: "^.{8,36}$",
					validationDescription: "At least 8 characters",
					validationError: "Less than 8 characters"
				)
			case .onlyAllowedChars:
				return Validation(
					pattern:
						"^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^*()\\-_=+\\[\\]{};:]+$",
					validationDescription: "Only allowed characters",
					validationError: "Contains forbidden characters"
				)
			case .requiresAtLeastOneSpecialChar:
				return Validation(
					pattern:
						"^(?=.*[0123456789!@#$%^*()\\-_=+\\[\\]{};:])[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^*()\\-_=+\\[\\]{};:]+$",
					validationDescription: "At least one special character",
					validationError: "Must contain at least one special character"
				)
		}
	}
}

extension String {
	/// Returns a validation error if the string doesn't match the validation type. If the string is valid, it returns nil.
	public func validate(_ type: ValidationType) -> LocalizedStringKey? {
		let predicate = NSPredicate(format: "SELF MATCHES %@", type.validationData.pattern)
		if !predicate.evaluate(with: self) {
			return type.validationData.validationError
		}
		return nil
	}

	public func validate(_ types: [ValidationType]) -> LocalizedStringKey? {
		for type in types {
			if let validationError = validate(type) {
				return validationError
			}
		}
		return nil
	}
}
