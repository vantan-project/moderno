<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\Furniture;

class S3Clear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 's3:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'S3に存在し、furnitures.image_urlに存在しない画像を削除';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('S3上のファイル一覧を取得中...');

        // S3の 'furnitures/' ディレクトリ以下の全ファイルを取得
        $allFiles = Storage::disk('s3')->allFiles('furnitures');

        $this->info('DB上の image_url を取得中...');
        $usedUrls = Furniture::pluck('image_url')->filter()->toArray();

        // S3のパスと比較できるように整形（プレフィックスなど除外）
        $usedPaths = array_map(function ($url) {
            // 例: https://bucket.s3.amazonaws.com/furnitures/image.jpg → furnitures/image.jpg
            return ltrim(parse_url($url, PHP_URL_PATH), '/');
        }, $usedUrls);

        // 未使用ファイルの抽出
        $unusedFiles = array_filter($allFiles, function ($file) use ($usedPaths) {
            return !in_array($file, $usedPaths);
        });

        if (empty($unusedFiles)) {
            $this->info('削除対象の未使用ファイルはありません。');
            return Command::SUCCESS;
        }

        $this->warn('未使用ファイルの削除を開始します...');

        foreach ($unusedFiles as $file) {
            Storage::disk('s3')->delete($file);
            $this->line("削除: {$file}");
        }

        $this->info('未使用ファイルの削除が完了しました。');
        return Command::SUCCESS;
    }
}
