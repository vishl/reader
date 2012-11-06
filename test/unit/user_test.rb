require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: users
#
#  id                 :integer         not null, primary key
#  name               :string(255)
#  email              :string(255)
#  encrypted_password :string(255)
#  salt               :string(255)
#  admin              :boolean
#  sid                :string(255)
#  created_at         :datetime
#  updated_at         :datetime
#  reset_token        :string(255)
#  reset_token_date   :datetime
#  reminder_day       :string(255)
#  reminder_time      :integer
#  settings           :text
#

