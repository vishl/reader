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

class Notifier < ActionMailer::Base
  default :from => "#{GlobalSettings.site_name} <notifications@#{GlobalSettings.mail_domain}>"
  #default :from => "#{GlobalSettings.site_name}@mail.#{GlobalSettings.app_domain}"

  def signup(user)
    @user = user
    mail(:to=>user.email, 
         :subject=>"Welcome to #{GlobalSettings.site_name}")
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
    mail(:to=>to_address, :from=>"#{@from.name} via #{GlobalSettings.site_name} <notifications@#{GlobalSettings.mail_domain}>", :subject=>"Check out #{@forum.title} on #{GlobalSettings.site_name}!")
  end

  def password_reset(user_id)
    @user = User.find(user_id)
    mail(:to=>@user.email, 
         :subject=>"Reset your password on #{GlobalSettings.site_name}")
  end

end
