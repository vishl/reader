require 'test_helper'

class MarkerTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: markers
#
#  id         :integer         not null, primary key
#  user_id    :integer
#  post_id    :integer
#  is_read    :boolean
#  is_starred :boolean
#  is_hidden  :boolean
#  created_at :datetime
#  updated_at :datetime
#  forum_id   :integer
#

