module Elcrypt
  def self.generate_sid
    SecureRandom.urlsafe_base64
  end
end
