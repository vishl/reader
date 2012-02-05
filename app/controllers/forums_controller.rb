class ForumsController < ApplicationController
  include ForumsHelper

  #create a new forum
  def spawn
    forum = Forum.new(params[:forum])
    forum.sid = generate_sid
    if(forum.save)
      redirect_to forum_path(forum.sid)
    else
      flash[:error] = "There was a problem"
      redirect_to root_path
    end
  end

  def show
    @forum = Forum.find_by_sid(params[:sid])
    @post = @forum.posts.build(params[:post])
    if(@forum)
      @posts = @forum.posts.order("updated_at DESC").limit(20).includes(:comments)
    else
      flash[:error] = "Forum not found"
      redirect_to root_path
    end
  end

  def post
    @forum = Forum.find_by_sid(params[:sid])
    @post = @forum.posts.build(params[:post])
    if(@forum)
    else
      flash[:error] = "Forum not found"
      redirect_to root_path
    end
  end

end
