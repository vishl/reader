class SubscriptionsController < ApplicationController
  before_filter :authenticate

  def create
    user = current_user
    forum = Forum.find_by_sid(params[:forum_id])
    if(forum.nil?)
      render :json=>{"forum"=>["is invalid"]}, :status=>400
    else
      sub = Subscription.new
      sub.forum_id = forum.id
      sub.user_id = user.id
      if(sub.save)
        render :nothing=>true
      else
        render :json=>sub.errors, :status=>500
      end
    end
  end

  def destroy
    user = current_user
    forum = Forum.find_by_sid(params[:forum_id])
    if(forum.nil?)
      render :json=>{"forum"=>["is invalid"]}, :status=>400
    else
      sub = Subscription.find_by_user_id_and_forum_id(user.id, forum.id)
      if(sub.nil?)
        render :json=>{"forum"=>["not subscribed"]}, :status=>400
      else
        sub.destroy
        render :nothing=>true
      end
    end
  end
end
