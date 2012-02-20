task :build do
  rm_r 'tmp'
  mkdir_p 'tmp/source'
  cp 'website/index.html.erb', 'tmp/source/'
  cp 'website/crew.html.erb', 'tmp/source/'
  cp_r 'website/layouts', 'tmp/source/layouts'
  touren = FileList.new('touren/**/meta.yaml')
  for tour in touren
    dir = File.dirname(tour)
    path = 'tmp/source/' + dir.slice(7, 4) + '-' + dir.slice(12, dir.length)
    mkdir_p path
    indexFile = File.open(path + '/index.html.md', 'w')
    indexFile.puts '---'
    indexFile.puts File.readlines(dir + '/meta.yaml')
    if File.exists?(dir + '/fotos.yaml') then
      indexFile.puts File.readlines(dir + '/fotos.yaml')
    end
    indexFile.puts '---'
    if File.exists?(dir + '/bericht.md') then
      indexFile.puts File.readlines(dir + '/bericht.md')
    end
    indexFile.close
  end
  cd 'tmp'
  touch 'config.rb'
  sh %{middleman build}
  cp_r 'build/.', '../build/'
  cd '..'
  #rm_r 'tmp'
end

task :assets do
  require 'yui/compressor'
  # TODO: add exclude variable for debugging
  
  jsFile = File.open('build/script.js', 'w')
  jsCompressor = YUI::JavaScriptCompressor.new()
  for js in FileList.new('website/javascripts/*.js')
    jsFile.puts jsCompressor.compress(File.open(js))
  end
  jsFile.close
  
  cssFile = File.open('build/style.css', 'w')
  cssCompressor = YUI::CssCompressor.new()
  for css in FileList.new('website/stylesheets/*.css')
    cssFile.puts cssCompressor.compress(File.open(css))
  end
  cssFile.close
end

task :fotos do
  require 'mini_magick'
  require 'archive/zip'
  # TODO: image compression (ie. https://github.com/grosser/smusher)
  oldDir = nil
  ordner = ENV['folder'] || 'touren'
  fotos = FileList.new(ordner.gsub(/^\/|\/$/, '') + '/**/*.jpg')
  for foto in fotos
    dir = File.dirname(foto)
    path = 'build/' + dir.slice(7, 4) + '-' + dir.slice(12, dir.length)
    
    if oldDir != dir then
      puts 'zipping ' + dir
      rm_f path.slice(0, dir.length-7) + '/fotos.zip'
      Archive::Zip.archive(path.slice(0, dir.length-7) + '/fotos.zip', dir + '/.')
    end
    oldDir = dir
    
    puts 'processing ' + foto
    mkdir_p path + '/max'
    max = MiniMagick::Image.open(foto)
    max.resize '800x600'
    max.quality '80'
    max.write path + '/max/' + File.basename(foto)
    
    mkdir_p path + '/min'
    min = MiniMagick::Image.open(foto)
    min.resize '100x75'
    min.quality '80'
    min.write path + '/min/' + File.basename(foto)
  end
end

task :fotos2meta do
  require 'mini_exiftool'
  ordner = ENV['folder'] || 'touren'
  fotos = FileList.new(ordner.gsub(/^\/|\/$/, '') + '/**/*.jpg')
  oldDir, metaFile = nil
  for foto in fotos
    puts 'reading ' + foto
    dir = File.dirname(foto)
    if dir != oldDir then
      if metaFile then
        metaFile.close
      end
      metaFile = File.open(dir + '/../fotos.yaml', 'w')
      metaFile.puts 'fotos:'
    end
    oldDir = dir
    exif = MiniExiftool.new foto
    metaFile.puts " '#{File.basename(foto).sub('.jpg', '')}': '#{exif.description}'"
  end
  metaFile.close
end

task :encode_film do
  ordner = ENV['folder'] || 'touren'
  filme = FileList.new(ordner.gsub(/^\/|\/$/, '') + '/**/film.*')
  for film in filme
    puts "encoding #{film}"
    dir = File.dirname(film)
    path = 'build/' + dir.slice(7, 4) + '-' + dir.slice(12, dir.length)
    sh %{ffmpeg -y -i #{film} -s 640x480 -threads 2 -acodec libvorbis -f webm -vcodec libvpx -qmax 32 -qmin 8 -aq 60 -ac 2 #{path}/film.webm}
    sh %{ffmpeg -y -i #{film} -s 640x480 -threads 2 -acodec libfaac -ab 96k -vcodec libx264 -vpre slow -crf 22 #{path}/film.mp4}
  end
end