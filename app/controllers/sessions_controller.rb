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
      render :json=>@user
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


