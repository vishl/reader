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

require 'cgi'
module SessionsHelper

  #sign in and sign out
  def sign_in(user, remember="temporary")
    if(Rails.env.test?)
      cookies[:remember_token] = [user.id, user.salt]
    elsif(remember=="remember")
      #permanent cookie
      cookies.permanent.signed[:remember_token] = [user.id, user.salt]
    elsif(remember.nil? || remember=="temporary")
      #2 week expire
      cookies.signed[:remember_token] = {:value=>[user.id, user.salt], :expires => 2.weeks.from_now}
    else #the correct value is "noremember", but anything will do
      #session cookie
      #this appears to only be deleted when you QUIT the browser, not close
      #the window, but that's probably ok
      cookies.signed[:remember_token] = [user.id, user.salt]
    end
    self.current_user = user
  end

  def sign_out
    cookies.delete(:remember_token)
    self.current_user = nil
  end

  def current_user=(user)
    @current_user = user
  end

  def current_user
    @current_user ||= user_from_remember_token
    @current_user ||= user_from_url_token
  end

  def current_user?(user)
    user && current_user && user.id == current_user.id
  end


  #3 levels of authentication
  def signed_in?
    !current_user.nil?
  end

  def correct_user? (user)
    current_user?(user) 
  end

  def admin_user?
    current_user && current_user.admin?
  end

  def authenticate
    deny_access unless signed_in?
  end


  def ensure_correct_user
    user = User.find_by_sid(params[:id])
    if not correct_user?(user) and not admin_user?
      logger.info("Permission denied")
      respond_to do |format|
        format.html do
          flash[:error] = "You don't have permission to access that page"
          redirect_to current_user ? user_path(current_user.sid) : root_path
        end
        format.json do
          render :text=>"Permission denied", :status=>401
        end
      end
    end
  end

  def ensure_admin
    unless admin_user?
      respond_to do |format|
        format.html do
          flash[:error] = "Permission denied"
          redirect_to(root_path)
        end
        format.json do
          render :text=>"Permission denied", :status=>401
        end
      end
    end
  end


  def deny_access
    respond_to do |format|
      format.html do
        store_location
        redirect_to signin_path, :notice => "Please sign in to access this page."
      end
      format.json do
        render :json=>{"authorization"=>"Please sign in"}, :status=>401
      end
    end
  end

  def redirect_back_or(default)
    redirect_to(session[:return_to] || default)
    clear_return_to
  end

  def admin_sign_in_as(user)
    if admin_user?
      link_to "Sign in", sessions_path(:session=>{:email=>user.email}), :method => :post
    end
  end

  def gen_token
    SecureRandom.urlsafe_base64
  end

  def authenticate_token_with(original, test)
    original==test
  end

  private
    

    def user_from_remember_token
      User.authentiticate_with_salt(*remember_token)
    end

    def user_from_url_token
      User.authenticate_with_token(params[:access_token])
    end

    def remember_token
      if(Rails.env.test?)
        ret = cookies[:remember_token] || [nil, nil]
        if ret.is_a?(String) #selenium fucks shit up
          ret = ret.split("&").map{|x| x.is_a?(String)?CGI.unescape(x):x}
        else 
          ret
        end
      else
        ret = cookies.signed[:remember_token] || [nil, nil]
      end
      if(ret.is_a?(Array) && ret.length==2)
        ret
      else
        [nil,nil]
      end
    end

    def store_location
      session[:return_to] = request.fullpath
    end

    def clear_return_to
      session[:return_to] = nil
    end

end


