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
      @latest_post_id = @forum.posts.latest.first.id
      @latest_comment_id = @forum.comments.latest.first.id
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

  def latest
    @forum = Forum.find_by_sid(params[:sid])
    if(@forum)
      latest_post = params[:latest_post].to_i
      latest_comment = params[:latest_comment].to_i
      if((latest_post != @forum.posts.latest.first.id) ||
         (latest_comment != @forum.comments.latest.first.id)
        )
        render :json=>{"has_error"=>false, "out_of_date"=>true}
      else
        render :json=>{"has_error"=>false, "out_of_date"=>false}
      end
    else
        render :json=>{"has_error"=>true}
    end
  end

  def postframe
    @forum=Forum.find_by_sid(params[:sid])
    @post = @forum.posts.find(params[:id])
    @content = params[:content]

    render :layout=>false
  end

  def commentview
    @forum=Forum.find_by_sid(params[:sid])
    @post = @forum.posts.find(params[:id])
    @content = params[:content]

    render :layout=>false
  end

end
