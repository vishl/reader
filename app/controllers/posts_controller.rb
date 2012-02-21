class PostsController < ApplicationController
  def create
    has_error=true
    message = ""
    @forum = Forum.find_by_sid(params[:forum_id])
    if(@forum)
      postparams = params[:post] || params.slice('name', 'content', 'comment')
      @post = @forum.posts.build(postparams)
      if(@post.save)
        message="Post created"
        has_error=false
      else
        message="Something went wrong: #{@post.errors}"
        has_error=true
      end
    else
      message="Invalid forum"
      has_error=true
    end

    respond_to do |format|
      format.json do
        render :json=>{'has_error'=>has_error, 'message'=>message, 'post'=>@post}
      end
      format.html do
        #defunct
        if(has_error)
          @posts = @forum.posts.limit(20).includes(:comments)
          flash.now[:error] = message
          render "forums/show"
        else
          flash[:success] = message
          redirect_to forum_path(@forum.sid)
        end
      end
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
