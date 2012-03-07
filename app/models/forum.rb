# == Schema Information
#
# Table name: forums
#
#  id         :integer         not null, primary key
#  title      :string(255)
#  sid        :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Forum < ActiveRecord::Base
  include SessionsHelper
  attr_accessible :title

  ################################### Associations ###############################
  has_many :posts
  has_many :comments, :through=>:posts
  has_many :subscriptions
  has_many :users, :through=>:subscriptions

  ################################### Validations ################################
  before_validation {self.sid ||= gen_token}

  validates :title, :presence=>true
  validates :sid, :presence=>true, :uniqueness=>true

  def as_json(options)
    options||={}
    #TODO include subscribers
    #TODO prefetch
    return {:title=>title, :id=>sid}
  end


end
