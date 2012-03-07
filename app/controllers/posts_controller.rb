class PostsController < ApplicationController
  before_filter :authenticate, :only=>[:create]

  def create
    @forum = Forum.find_by_sid(params[:forum_id])
    if(@forum)
      postparams = params[:post] || params.slice('content', 'comment')
      @post = @forum.posts.build(postparams)
      @post.user_id = current_user.id
      if(@post.save)
        #no errors
        render :json=>{'post'=>@post}
      else
        logger.error("Something went wrong: #{@post.errors}")
        render :text=>"Something went wrong: #{@post.errors}", :status=>400
      end
    else
      render :text=>"Invalid Forum", :status=>400
    end
  end

  def show
    has_error=false
    message = ""
    @forum = Forum.find_by_sid(params[:forum_id])
    if(@forum)
      @post = @forum.posts.find_by_id(params[:id])
      if(@post)
        has_error=false;
      else
        has_error=true
        message="Invalid post";
      end
    else
      has_error=true;
      message="Invalid forum";
    end

    respond_to do |format|
      format.json {
        if(has_error)
          #TODO http error code
          render :json=>{'has_error'=>true, 'message'=>message}
        else
          render :json=>@post
        end
      }
    end
  end
          

end
