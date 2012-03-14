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
end
