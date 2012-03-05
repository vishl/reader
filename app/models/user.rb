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
#

class User < ActiveRecord::Base
  include SessionsHelper

  attr_accessor :password
  attr_accessible :name, :email, :password

  #initializer
  after_initialize :init
  #after_create :remove_from_whitelist

  ################################### Associations ###############################
  #this is a join table
  has_many :visits, :dependent=>:destroy
  #these are tours we have visited
  has_many :tours, :through=>:visits
  #these are tours we have created
  has_many :tours_owned, :class_name=>"Tour"

  
  ################################### Validations ################################
  #Validators 
  before_validation :strip_whitespace
  before_validation {self.email = self.email.downcase if self.email?}
  before_validation {self.sid ||= gen_token}

  @email_regex = /^[\w+-]+(\.[\w+-]+)*@([\w-]+\.)+\w+$/i
  @name_regex = /^[A-Za-z -]{1,30}$/
  validates :name,  :format => {:with => @name_regex}
  validates :email, :format   => { :with => @email_regex },
                    :uniqueness => {:case_sensitive => false, :message=>"already has an account"}
  validates :password,  :length =>{ :within => 6..40 },
                        #allows updating the record without supplying a new password
                        :if => lambda{self.password.present? || self.encrypted_password.blank?}

  validates :sid,         :presence=>true, :uniqueness=>true

  #encrypt password before saving to db
  before_save :encrypt_password, 
              :if => lambda{self.password.present?}

  ################################### Methods ####################################
  #password helpers
  
  def has_password?(submitted_password)
    salt && encrypted_password && (encrypted_password == encrypt(submitted_password))
  end


  def generate_reset
    self[:reset_token] = SecureRandom.urlsafe_base64
    self[:reset_token_date] = Time.now
    unless (self.save)
      logger.error("unable to generate reset token")
      logger.error(self.errors)
      false
    else
      link = Rails.application.routes.url_helpers.users_reset_page_path(self, self[:reset_token])
      #send an email with the above link instead of this logger message
      logger.debug("Your password reset link is #{link}")
      href = "#{GlobalSettings.app_protocol+GlobalSettings.app_domain}#{link}"
      Notifier.delay.pwd_reset(self,href)
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
    return {:email=>email, :id=>sid, :name=>name}
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



