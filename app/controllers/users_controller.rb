class UsersController < ApplicationController
  before_filter :ensure_correct_user, :only=>[:edit, :update, :destroy]
  before_filter :ensure_admin, :only=>:index

  def create
    #create a new user
    @user = User.new(params)
    if @user.save
      sign_in(@user)
      render :json=>@user
    else
      render :json=>@user.errors, :status=>400
    end
  end

  def show
    @user = User.find_by_sid(params[:id])
  end

  def update
  end

  def destroy
    @user = User.find_by_sid(params[:id])
    @user.destroy
  end

  def index
    @users = User.paginate(:page => params[:page])
  end
end
