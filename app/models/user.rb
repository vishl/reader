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

#Copyright 2012 Vishal Parikh
#This file is part of Freader.
#Freader is free software: you can redistribute it and/or modify
#it under the terms of the GNU General Public License as published by
#the Free Software Foundation, either version 3 of the License, or
#(at your option) any later version.
#
#Freader is distributed in the hope that it will be useful,
#but WITHOUT ANY WARRANTY; without even the implied warranty of
#MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#GNU General Public License for more details.
#
#You should have received a copy of the GNU General Public License
#along with Freader.  If not, see <http://www.gnu.org/licenses/>.

class User < ActiveRecord::Base
  include SessionsHelper

  attr_accessor :password, :current_password, :reminder, :reset_override
  attr_accessible :name, :email, :password, :current_password, :reminder_day, :reminder_time, :reminder, :settings

  #initializer
  after_initialize :init
  #after_create :remove_from_whitelist

  ################################### Associations ###############################
  has_many :subscriptions, :dependent=>:destroy
  has_many :forums, :through=>:subscriptions
  has_many :posts, :dependent=>:destroy

  
  ################################### Validations ################################
  #Validators 
  before_validation :strip_whitespace
  before_validation {self.email = self.email.downcase if self.email?}
  before_validation {self.sid ||= gen_token}
  before_validation :check_password_update
  before_validation {self.reminder_day = "Never" if self.reminder==false}

  @email_regex = /^[\w+-]+(\.[\w+-]+)*@([\w-]+\.)+\w+$/i
  @name_regex = /^[A-Za-z\u00C0-\u00FF -]{1,30}$/
  validates :name,  :format => {:with => @name_regex}
  validates :email, :format   => { :with => @email_regex },
                    :uniqueness => {:case_sensitive => false, :message=>"already has an account"}
  validates :password,  :length =>{ :within => 6..40 },
                        #allows updating the record without supplying a new password
                        :if => lambda{self.password.present? || self.encrypted_password.blank?}
  validates :reminder_day, :inclusion=>{:in=>%w(Never Daily Mon Tue Wed Thu Fri Sat Sun)}

  validates :sid,         :presence=>true, :uniqueness=>true

  #encrypt password before saving to db
  before_save :encrypt_password, 
              :if => lambda{self.password.present?}

  ################################### Methods ####################################
  
  def get_settings
    if(self.settings.present?)
      j = JSON.parse self.settings
      return j
    else
      return {}
    end
  end

  def set_settings(s)
    self.settings = JSON.stringify(s)
    self.save!
  end
    
  def get_setting(key)
    return get_settings[key]
  end

  def set_setting(key, val)
    j = get_settings
    j[key] = val
    set_settings(j)
  end
  
  def subscribed_to?(forum)
    if(forum.nil?)
      return false;
    else
      sub = Subscription.find_by_user_id_and_forum_id(id, forum.id)
      if(sub && sub.subscribed?)
        return true;
      else
        return false;
      end
    end
  end
  #password helpers

  #if we update our password, we must supply the old password
  def check_password_update
    if(!reset_override && encrypted_password.present? && password.present?)
      if(!has_password?(current_password))
        errors.add("current_password", "is invalid")
        return false
      end
    end
    return true
  end
  
  def has_password?(submitted_password)
    salt && encrypted_password && (encrypted_password == encrypt(submitted_password))
  end


  def generate_reset
    self.reset_token = SecureRandom.urlsafe_base64
    self.reset_token_date = Time.now
    unless (self.save)
      logger.error("unable to generate reset token")
      logger.error(self.errors)
      false
    else
      link = "users/#{id}/reset/#{reset_token}";
      logger.debug("Generated reset path #{link}")
      Notifier.delay.password_reset(id)
      true
    end
  end

  def validate_password_token(token)
    token.present? && token == self[:reset_token] && ((Time.now-self[:reset_token_date])<24.hours)
  end

  def invalidate_password_token
    self[:reset_token] = ""
    unless self.save
      logger.error("cannot invalidate password token")
    end
  end

  def remove_from_whitelist
    #TODO no whitelist yet
    wl = Whitelist.find_by_email_lc(self.email)
    wl.destroy if wl
  end

  def as_json(options)
    options||={}
    #TODO include posts?
    attrs =  {:id=>sid, :name=>name}
    if(options[:private_data])
      attrs = attrs.merge({:email=>email, :subscriptions=>forums.as_json(options), :reminder_day=>reminder_day, :reminder_time=>reminder_time, :settings=>get_settings})
    end
    return attrs
  end


  ################################### Class Methods ##############################

  def self.authenticate(email, submitted_password)
    user = find_by_email_lc(email.strip)
    return nil if user.nil?
    return user if user.has_password?(submitted_password)
  end

  def self.authentiticate_with_salt(id, cookie_salt)
    user = find_by_id(id)
    if (user && (user.salt==cookie_salt)) 
      user 
    else 
      nil
    end
  end

  def self.find_by_email_lc(email)
    User.find(:first, :conditions=>["lower(email) = ?", email.respond_to?(:downcase) ? email.downcase : email]) 
  end
  
  def to_s
    "USER:#{self.id}/#{self.email}"
  end

  def self.email_regex
    @email_regex
  end

  
  private
    #remove leading and trailing whitespace for username
    def strip_whitespace
      self.email = self.email.strip if self.email
    end
    
    def self.is_email?(email)
      email.scan(@email_regex).present?
    end

    def encrypt_password
      self.salt = make_salt unless has_password?(password)
      self.encrypted_password = encrypt(password)
    end

    def encrypt(string)
      BCrypt::Engine.hash_secret(string, salt)
    end

    def make_salt
      BCrypt::Engine.generate_salt
    end

    def init
    end
    

end



