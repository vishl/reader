class UsersController < ApplicationController
  before_filter :ensure_correct_user, :only=>[:edit, :update, :destroy]
  before_filter :ensure_admin, :only=>:index

  def create
    #create a new user
    @user = User.new(params)
    if @user.save
      sign_in(@user)
      render :json=>@user.as_json(:private_data=>true)
      Notifier.signup(@user).deliver
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
