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

class SessionsController < ApplicationController
  include SessionsHelper
  def new
    @user = User.new(params[:user])
  end

  def create
    if(admin_user?)
      #this allows admin to sign in as anybody
      @user = User.find_by_email_lc(params[:email])
    else
      @user = User.authenticate(params[:email],
                               params[:password])
    end 

    sign_in(@user, params[:remember]) if(@user)

    if(@user.nil?)
      if(User.find_by_email_lc(params[:email]).nil?)
        render :json=>{"email"=>["Email does not exist, please sign up"]}, :status=>401
      else
        render :json=>{"password"=>["Invalid password"]}, :status=>401
      end
    else
      render :json=>@user.as_json(:private_data=>true, :current_user=>@user)
    end

#    respond_to do |f|
#      f.html {
#        if(@user.nil?)
#          #signin failed
#          flash.now[:error] = "Invalid email/password combination."
#          @user = User.new(params[:user])
#          render 'new'
#        else
#          #signin success
#          redirect_back_or user_path(@user.sid)
#        end
#      }
#      f.js
#    end
  end

  def destroy
    sign_out
    redirect_to root_path
  end

  #A form for a user who forgot their password
  def forgot
  end
end


