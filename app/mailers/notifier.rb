class Notifier < ActionMailer::Base
  default :from => "no-reply@mail.#{GlobalSettings.app_domain}"

  def signup(user)
    @user = user
    mail(:to=>user.email, :subject=>"Welcome to #{GlobalSettings.site_name}")
  end
end
