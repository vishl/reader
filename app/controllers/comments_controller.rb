class CommentsController < ApplicationController
  before_filter :authenticate

  def create
    has_error=false
    message = ""
    #TODO make sure user has permission to post in this forum
    @forum = Forum.find_by_sid(params[:forum_id])
#    if(@forum)
#      @post = @forum.posts.find_by_id(params[:post_id])
#      if(@post)
#        @comment = @post.comments.build(params.slice(:content))
#        if(@comment.save)
#          #success
#          render :json=>{'comment'=>@comment}
#        else
#          logger.error("Comment posting error: #{@comment.errors}")
#          render :json=>@comment.errors, :status=>400
#        end
#      else
#        logger.error("Comment posting error: can't find post with id #{params[:post_id]}")
#        render :json=>{"post"=>"invalid ID"}, :status=>400
#      end
#    else
#      logger.error("Comment posting error: can't find forum with id #{params[:forum_id]}")
#      render :json=>{"post"=>"invalid ID"}, :status=>400
#    end

    if(!@forum)
      logger.error("Comment posting error: can't find forum with id #{params[:forum_id]}")
      render :json=>{"post"=>"invalid ID"}, :status=>400
    else
      @post = @forum.posts.find_by_id(params[:post_id])
      if(!@post)
        logger.error("Comment posting error: can't find post with id #{params[:post_id]}")
        render :json=>{"post"=>"invalid ID"}, :status=>400
      else
        @comment = @post.comments.build(params.slice(:content))
        @comment.user_id = current_user.id
        if(!@comment.save)
          logger.error("Comment posting error: #{@comment.errors}")
          render :json=>@comment.errors, :status=>400
        else
          #success
          render :json=>{'comment'=>@comment}
        end
      end
    end
  end

end
