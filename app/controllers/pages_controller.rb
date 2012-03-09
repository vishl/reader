class PagesController < ApplicationController
  def home
    @forum = Forum.new
  end

  def bookmarklet
    @sid = params[:sid]
    render 'bookmarklet', :layout=>false, :content_type=>"text/javascript"
  end

  def backbone
  end

  def bbcv
    @content = params[:content]
    render :layout=>false
  end

  def postframe
    render :layout=>false
  end

  def test
    if(GlobalSettings.deployment=="live")
      redirect_to root_path
    else
      @user = User.find_by_email("vparikh1@gmail.com")
      @forums={}
      fs = @user.forums
      fs.each do |f|
        @forums[f] = f.posts.limit(2) if (f.posts.count>0)
      end
      if(params[:signup])
        render 'notifier/signup', :layout=>false
      else
        render 'notifier/updates', :layout=>false
      end
      if(params[:deliver])
        if(params[:signup])
          Notifier.signup(@user).deliver
        else
          Notifier.updates(@user, @forums).deliver
        end
      end
    end
  end
end
