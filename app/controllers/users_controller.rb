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

class UsersController < ApplicationController
  before_filter :ensure_correct_user, :only=>[:edit, :update, :destroy]
  before_filter :ensure_admin, :only=>:index

  def create
    #create a new user
    @user = User.new(params)
    if @user.save
      sign_in(@user)
      render :json=>@user.as_json(:private_data=>true)
      Notifier.signup(@user).deliver if GlobalSettings.email_enabled
    else
      render :json=>@user.errors, :status=>400
    end
  end

  def show
    @user = User.find_by_sid(params[:id])
    render :json=>@user.as_json(:private_data=>correct_user?(@user))
  end

  def update
    @user = User.find_by_sid(params[:id])
    if(@user.update_attributes(params))
      sign_in @user
      render :json=>@user.as_json(:private_data=>correct_user?(@user))
    else
      render :json=>@user.errors, :status=>400
    end
  end

  def destroy
    @user = User.find_by_sid(params[:id])
    @user.destroy
  end

  def index
    @users = User.paginate(:page => params[:page])
  end

  ################################### Password reset ##############################
  def gen_reset
    email = params[:email]
    user = User.find_by_email_lc(email)
    if(user.nil?)
      render :json=>{"email"=>["Does not have an account"]}, :status=>400
    else
      unless(user.generate_reset)
        render :json=>{"internal"=>["#{user.errors}"]}, :status=>500
      else
        #success
        #TODO send email
        logger.info("ACTION: User generated reset #{@user}")
        render :json=>{}
      end
    end
  end

  def reset_post
    user = User.find_by_sid(params[:id])
    @token = params[:token]
    if(!(user && user.validate_password_token(@token)))
      render :json=>{"authorization"=>"Permission Denied"}, :status=>401
    else
      user.password = params[:password]
      user.reset_override=true   #lets us reset the password without giving the old one
      if(user.password.blank?)
        render :json=>{"password"=>["Please enter a password"]}, :status=>400
      elsif(!user.save)
        render :json=>user.errors, :status=>400
      else
        #success, remove token since its one time use
        user.invalidate_password_token
        render :json=>user
      end
    end
  end
  
end
