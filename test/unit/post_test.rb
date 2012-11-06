require 'test_helper'

class PostTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: posts
#
#  id         :integer         not null, primary key
#  name       :string(255)
#  content    :text
#  comment    :text
#  created_at :datetime
#  updated_at :datetime
#  forum_id   :integer
#  user_id    :integer
#  updatetime :datetime
#

