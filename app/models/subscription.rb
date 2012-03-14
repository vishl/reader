# == Schema Information
#
# Table name: subscriptions
#
#  id         :integer         not null, primary key
#  user_id    :integer
#  forum_id   :integer
#  created_at :datetime
#  updated_at :datetime
#  status     :string(255)
#

class Subscription < ActiveRecord::Base
  attr_accessible :forum_id
  ################################### Associations ###############################
  belongs_to :forum
  belongs_to :user

  ################################### Validations ################################
  validates_uniqueness_of :user_id, :scope => :forum_id
  validates_presence_of :user_id, :forum_id
  validates :status, :format => {:with=>/^(owner)?$/}

  def subscribed?()
    return true;
  end

  def as_json(options)
    return {:user_id=>user.sid, :forum_id=>forum.sid, :forum_title=>forum.title, :subscribed=>true, :id=>forum.sid}
  end
end
