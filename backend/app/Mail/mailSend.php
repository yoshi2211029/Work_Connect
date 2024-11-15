<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;


class MailSend extends Mailable
{
    use Queueable, SerializesModels;

    public $user; // プロパティとして定義
    public $details; // プロパティとして定義

    /**
     * Create a new message instance.
     */
    public function __construct($user,$details) // コンストラクタで受け取る
    {
        $this->user = $user;
        $this->details = $details;
    }

    public function build()
    {
        return $this->to($this->user->mail) 
                    ->subject('【 Work&Connect 】本登録確認URLについて')
                    ->view('emails.text'); // ビュー名を指定
    }
}