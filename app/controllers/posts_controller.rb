class PostsController < ApplicationController
  def create
    @forum = Forum.find_by_sid(params[:sid])
    if(@forum)
      @post = @forum.posts.build(params[:post])
      if(@post.save)
        redirect_to forum_path(@forum.sid)
      else
        flash.now[:error]="Something went wrong: #{@post.errors}"
        @posts = @forum.posts.limit(20).includes(:comments)
        render "forums/show"
      end
    else
      flash[:error]="Invalid forum"
      redirect_to root_path
    end
  end

end
