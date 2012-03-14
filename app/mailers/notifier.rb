class Notifier < ActionMailer::Base
  #TODO better from
  #default :from => "#{GlobalSettings.site_name} <notifications@mail.#{GlobalSettings.app_domain}>"
  default :from => "#{GlobalSettings.site_name}@mail.#{GlobalSettings.app_domain}"

  def signup(user)
    @user = user
    mail(:to=>user.email, :subject=>"Welcome to #{GlobalSettings.site_name}")
  end

  def updates(user, forums)
    @user = user
    @forums=forums
    mail(:to=>user.email, :subject=>"New stuff is posted on #{GlobalSettings.site_name}!")
  end

  def invite(to_address, from, forum)
    @from = from
    @name = from.name
    @forum= forum
    mail(:to=>to_address, :from=>"#{@from.name} <#{@from.email}>", :subject=>"New stuff is posted on #{GlobalSettings.site_name}!")
  end

end
